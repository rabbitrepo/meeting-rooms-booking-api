import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMeetingRoom } from './models/meeting-rooms.schema';
import { Model, Types } from 'mongoose';
import { BranchesService } from '../branches/branches.service';
import { CreateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/create-meeting-rooms.dto';
import { RpcException } from '@nestjs/microservices';
import { UpdateMeetingRoomsDto } from '@app/contracts/resources/meeting-rooms/update-meeting-rooms.dto';

@Injectable()
export class MeetingRoomsService {
  constructor(
    @InjectModel('MeetingRoom')
    private readonly meetingRoomModel: Model<IMeetingRoom>,
    @Inject(forwardRef(() => BranchesService))
    private readonly branchesService: BranchesService,
  ) {}

  async create(createMeetingRoomsDto: CreateMeetingRoomsDto) {
    const { branchId, name } = createMeetingRoomsDto;

    // Check if the branch with the given ID exists
    const branchExists = await this.branchesService.findOne(branchId);
    if (!branchExists) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with ID ${branchId} does not exist.`,
      });
    }

    // Check if a meeting room with the same name already exists in the same branch
    const existingMeetingRoom = await this.meetingRoomModel
      .findOne({ branchId, name })
      .exec();
    if (existingMeetingRoom) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: `A meeting room with the name "${name}" already exists in branch ${branchId}.`,
      });
    }

    // Create and save the new meeting room
    const createdMeetingRoom = new this.meetingRoomModel(createMeetingRoomsDto);
    const result = await createdMeetingRoom.save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Meeting Room created successfully',
      data: {
        meetingRoom: result,
      },
    };
  }

  async findAll() {
    const meetingRooms = await this.meetingRoomModel.find().exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Meeting Rooms retrieved successfully',
      data: {
        meetingRooms,
      },
    };
  }

  async findOne(id: string) {
    const meetingRoom = await this.meetingRoomModel.findById(id).exec();
    if (!meetingRoom) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Meeting Room with ID ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Meeting Room retrieved successfully',
      data: {
        meetingRoom,
      },
    };
  }

  async findByBranch(branchId: string) {
    // Check if the branch with the given ID exists
    const branchExists = await this.branchesService.findOne(branchId);
    if (!branchExists) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with ID ${branchId} does not exist.`,
      });
    }

    // Fetch all meeting rooms associated with the branchId
    const meetingRooms = await this.meetingRoomModel.find({ branchId }).exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Meeting Rooms retrieved successfully',
      data: {
        meetingRooms,
      },
    };
  }

  async update(id: string, updateMeetingRoomsDto: UpdateMeetingRoomsDto) {
    const { branchId, name } = updateMeetingRoomsDto;

    // Check if the meeting room exists
    const meetingRoom = await this.meetingRoomModel.findById(id).exec();
    if (!meetingRoom) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Meeting Room with ID ${id} not found.`,
      });
    }

    // Check if branchId is a valid MongoDB ObjectId
    if (branchId && !Types.ObjectId.isValid(branchId)) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with ID ${branchId} is not a valid MongoDB ObjectId.`,
      });
    }

    // Check if branchId exists and validate if it exists
    if (branchId) {
      const branchExists = await this.branchesService.findOne(branchId);
      if (!branchExists) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Branch with ID ${branchId} does not exist.`,
        });
      }
    }

    // Check if name exists and validate if it's a duplicate in the same branch
    if (name && name !== meetingRoom.name) {
      const duplicateMeetingRoom = await this.meetingRoomModel
        .findOne({ branchId: branchId ?? meetingRoom.branchId, name })
        .exec();
      if (duplicateMeetingRoom) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: `A meeting room with the name "${name}" already exists in branch ${branchId ?? meetingRoom.branchId}.`,
        });
      }
    }

    // Perform the update
    const updatedMeetingRoom = await this.meetingRoomModel
      .findByIdAndUpdate(id, updateMeetingRoomsDto, { new: true })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Meeting Room updated successfully',
      data: {
        meetingRoom: updatedMeetingRoom,
      },
    };
  }

  async remove(id: string) {
    const result = await this.meetingRoomModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Meeting Room with ID ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Meeting Room deleted successfully',
      data: {
        deleted: true,
      },
    };
  }
}
