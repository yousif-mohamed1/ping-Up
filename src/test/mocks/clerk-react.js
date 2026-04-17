import React from 'react'
import { vi } from 'vitest'

const defaultState = {
  user: null,
  isLoaded: true,
  isSignedIn: false,
}

const state = { ...defaultState }

const fns = {
  signOut: vi.fn(async () => undefined),
  openSignIn: vi.fn(),
  openUserProfile: vi.fn(),
  getToken: vi.fn(async () => 'mock-token'),
}

export const setClerkUser = (user) => {
  state.user = user
  state.isSignedIn = Boolean(user)
  state.isLoaded = true
}

export const setClerkLoaded = (isLoaded) => {
  state.isLoaded = Boolean(isLoaded)
}

export const resetClerkMocks = () => {
  state.user = defaultState.user
  state.isLoaded = defaultState.isLoaded
  state.isSignedIn = defaultState.isSignedIn

  fns.signOut.mockReset()
  fns.signOut.mockResolvedValue(undefined)
  fns.openSignIn.mockReset()
  fns.openUserProfile.mockReset()
  fns.getToken.mockReset()
  fns.getToken.mockResolvedValue('mock-token')
}

const ClerkProvider = ({ children }) => {
  return React.createElement(React.Fragment, null, children)
}

const SignIn = (props) => {
  return React.createElement('div', { 'data-testid': 'clerk-sign-in', ...props })
}

const UserButton = (props) => {
  return React.createElement(
    'button',
    { type: 'button', 'data-testid': 'clerk-user-button', ...props },
    'User',
  )
}

const SignedIn = ({ children }) => {
  return state.isSignedIn ? React.createElement(React.Fragment, null, children) : null
}

const SignedOut = ({ children }) => {
  return !state.isSignedIn ? React.createElement(React.Fragment, null, children) : null
}

const RedirectToSignIn = () => null

const useUser = () => {
  return {
    user: state.user,
    isLoaded: state.isLoaded,
    isSignedIn: state.isSignedIn,
  }
}

const useClerk = () => {
  return {
    signOut: fns.signOut,
    openSignIn: fns.openSignIn,
    openUserProfile: fns.openUserProfile,
  }
}

const useAuth = () => {
  return {
    isLoaded: state.isLoaded,
    isSignedIn: state.isSignedIn,
    userId: state.user?.id ?? null,
    getToken: fns.getToken,
  }
}

export const createClerkReactMock = () => {
  return {
    __esModule: true,
    ClerkProvider,
    SignIn,
    UserButton,
    SignedIn,
    SignedOut,
    RedirectToSignIn,
    useUser,
    useClerk,
    useAuth,
  }
}
