import { Timestamp } from 'firebase/firestore';

type TimestampLike = Timestamp | { seconds: number; nanoseconds: number } | number | string;

export function toDate(timestamp: TimestampLike): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (typeof timestamp === 'object' && 'seconds' in timestamp) {
    return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
  }
  // Handle numeric (Unix) and string timestamps
  return new Date(timestamp);
}