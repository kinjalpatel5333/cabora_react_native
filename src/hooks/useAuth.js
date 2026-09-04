import {useAppDispatch, useAppSelector} from '../redux/hooks';

export {useAppDispatch, useAppSelector};

export function useAuth() {
  return useAppSelector(state => state.auth);
}
