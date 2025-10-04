// Web adapter - HTTP controller
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../core/services/UserService';
import { UserRepository } from '../../database/repositories/UserRepository';

export class UserController {
  private userService: UserService;

  constructor() {
    const userRepository = new UserRepository();
    this.userService = new UserService(userRepository);
  }

  async createUser(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { email, name } = body;

      const user = await this.userService.createUser(email, name);

      return NextResponse.json(
        { success: true, data: user },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 400 }
      );
    }
  }

  async getUserById(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const user = await this.userService.getUserById(params.id);

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, data: user },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 500 }
      );
    }
  }

  async updateUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      const body = await request.json();
      const updates = body;

      const user = await this.userService.updateUser(params.id, updates);

      return NextResponse.json(
        { success: true, data: user },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 400 }
      );
    }
  }

  async deleteUser(request: NextRequest, { params }: { params: { id: string } }): Promise<NextResponse> {
    try {
      await this.userService.deleteUser(params.id);

      return NextResponse.json(
        { success: true, message: 'User deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
        { status: 400 }
      );
    }
  }
}
