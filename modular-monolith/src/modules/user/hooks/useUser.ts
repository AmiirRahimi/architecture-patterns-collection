// Module-specific hook
'use client';

import { useState, useEffect } from 'react';
import { User, CreateUserData, UpdateUserData } from '../types/user.types';
import { userService } from '../services/userService';

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedUsers = await userService.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: CreateUserData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const newUser = await userService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: UpdateUserData): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await userService.updateUser(id, data);
      if (updatedUser) {
        setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      }
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const success = await userService.deleteUser(id);
      if (success) {
        setUsers(prev => prev.filter(user => user.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Listen for events from other modules
    const handleUserCreated = (event: CustomEvent<User>) => {
      setUsers(prev => [...prev, event.detail]);
    };

    const handleUserUpdated = (event: CustomEvent<User>) => {
      setUsers(prev => prev.map(user => user.id === event.detail.id ? event.detail : user));
    };

    const handleUserDeleted = (event: CustomEvent<User>) => {
      setUsers(prev => prev.filter(user => user.id !== event.detail.id));
    };

    window.addEventListener('user:created', handleUserCreated as EventListener);
    window.addEventListener('user:updated', handleUserUpdated as EventListener);
    window.addEventListener('user:deleted', handleUserDeleted as EventListener);

    return () => {
      window.removeEventListener('user:created', handleUserCreated as EventListener);
      window.removeEventListener('user:updated', handleUserUpdated as EventListener);
      window.removeEventListener('user:deleted', handleUserDeleted as EventListener);
    };
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};
