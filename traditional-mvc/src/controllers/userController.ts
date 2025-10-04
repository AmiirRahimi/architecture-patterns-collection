// Controller - Request handling and coordination
import { NextRequest, NextResponse } from 'next/server';
import { User, UserData } from '../models/User';
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /api/users
  async getAllUsers(): Promise<NextResponse> {
    try {
      const users = await this.userService.getAllUsers();
      
      return NextResponse.json({
        success: true,
        data: users.map(user => user.toJSON())
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      }, { status: 500 });
    }
  }

  // GET /api/users/[id]
  async getUserById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const user = await this.userService.getUserById(params.id);
      
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      }, { status: 500 });
    }
  }

  // POST /api/users
  async createUser(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { email, name } = body;

      // Validation in controller
      if (!email || !name) {
        return NextResponse.json({
          success: false,
          error: 'Email and name are required'
        }, { status: 400 });
      }

      const user = await this.userService.createUser(email, name);

      return NextResponse.json({
        success: true,
        data: user.toJSON()
      }, { status: 201 });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      }, { status: 400 });
    }
  }

  // PUT /api/users/[id]
  async updateUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { email, name } = body;

      const user = await this.userService.updateUser(params.id, { email, name });

      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: user.toJSON()
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      }, { status: 400 });
    }
  }

  // DELETE /api/users/[id]
  async deleteUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const success = await this.userService.deleteUser(params.id);

      if (!success) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      }, { status: 500 });
    }
  }
}
