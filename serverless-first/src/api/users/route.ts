// API Route - Serverless function
import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '@/lib/services/UserService';

export async function GET(request: NextRequest) {
  try {
    const userService = new UserService();
    const users = await userService.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: users,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validation
    if (!email || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email and name are required',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    const userService = new UserService();
    const user = await userService.createUser(email, name);
    
    return NextResponse.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user',
      timestamp: new Date().toISOString(),
    }, { status: 400 });
  }
}
