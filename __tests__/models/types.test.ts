import { isValidTravelMode, isValidMemberRole, isValidActivityAction } from '../../models/types';

describe('type guards', () => {
  test('isValidTravelMode accepts valid modes', () => {
    expect(isValidTravelMode('flying')).toBe(true);
    expect(isValidTravelMode('driving')).toBe(true);
    expect(isValidTravelMode('train')).toBe(true);
    expect(isValidTravelMode('bus')).toBe(true);
    expect(isValidTravelMode('other')).toBe(true);
  });

  test('isValidTravelMode rejects invalid modes', () => {
    expect(isValidTravelMode('bicycle')).toBe(false);
    expect(isValidTravelMode('')).toBe(false);
  });

  test('isValidMemberRole accepts valid roles', () => {
    expect(isValidMemberRole('owner')).toBe(true);
    expect(isValidMemberRole('member')).toBe(true);
  });

  test('isValidMemberRole rejects invalid roles', () => {
    expect(isValidMemberRole('admin')).toBe(false);
  });

  test('isValidActivityAction accepts valid actions', () => {
    expect(isValidActivityAction('member_added')).toBe(true);
    expect(isValidActivityAction('member_removed')).toBe(true);
    expect(isValidActivityAction('member_restored')).toBe(true);
    expect(isValidActivityAction('member_left')).toBe(true);
  });

  test('isValidActivityAction rejects invalid actions', () => {
    expect(isValidActivityAction('member_banned')).toBe(false);
  });
});
