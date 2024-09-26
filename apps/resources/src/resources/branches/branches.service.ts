import { CreateBranchDto } from '@app/contracts/resources/branches/create-branch.dto';
import { UpdateBranchDto } from '@app/contracts/resources/branches/update-branch.dto';
import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { IBranch } from './models/branches.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MeetingRoomsService } from '../meeting-rooms/meeting-rooms.service';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel('Branch')
    private readonly branchModel: Model<IBranch>,
    @Inject(forwardRef(() => MeetingRoomsService))
    private readonly meetingRoomsService: MeetingRoomsService,
  ) {}

  // New method to check if a branch name already exists
  async isBranchNameDuplicate(name: string): Promise<boolean> {
    const existingBranch = await this.branchModel.findOne({ name }).exec();
    return !!existingBranch;
  }

  // Existing methods
  async create(createBranchDto: CreateBranchDto) {
    if (await this.isBranchNameDuplicate(createBranchDto.name)) {
      throw new RpcException({
        status: HttpStatus.CONFLICT,
        message: 'A branch with this name already exists.',
      });
    }

    const createdBranch = new this.branchModel(createBranchDto);
    const result = await createdBranch.save();

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Branch created successfully',
      data: {
        branch: result,
      },
    };
  }

  async findAll() {
    const branches = await this.branchModel.find().exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Branches retrieved successfully',
      data: {
        branches,
      },
    };
  }

  async findOne(id: string) {
    const branch = await this.branchModel.findById(id).exec();
    if (!branch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with id: ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Branch retrieved successfully',
      data: {
        branch,
      },
    };
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const currentBranch = await this.branchModel.findById(id).exec();
    if (!currentBranch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with id: ${id} not found.`,
      });
    }

    if (updateBranchDto.name && updateBranchDto.name !== currentBranch.name) {
      if (await this.isBranchNameDuplicate(updateBranchDto.name)) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'A branch with this name already exists.',
        });
      }
    }

    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(id, updateBranchDto, { new: true })
      .exec();

    return {
      statusCode: HttpStatus.OK,
      message: 'Branch updated successfully',
      data: {
        branch: updatedBranch,
      },
    };
  }

  async remove(id: string) {
    const deletedBranch = await this.branchModel.findByIdAndDelete(id).exec();

    if (!deletedBranch) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Branch with id: ${id} not found.`,
      });
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Branch deleted successfully',
      data: {
        deleted: true,
      },
    };
  }
}
