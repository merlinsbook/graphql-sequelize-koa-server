import { fromJS } from 'immutable';

export const combineResolvers = (resolvers) => {
  return fromJS({}).mergeDeep(...resolvers).toJS();
}