export enum Role {
  KID = 'KID',
  PARENT = 'PARENT',
  TEACHER = 'TEACHER'
}

export interface Wish {
  id: string;
  item: string;
  priceEstimate?: string;
  retailer?: string;
  status: 'PENDING' | 'APPROVED' | 'DENIED' | 'MAYBE';
  timestamp: number;
}

export interface Note {
  id: string;
  author: Role;
  content: string;
  type: 'BEHAVIOR' | 'ACADEMIC' | 'ACHIEVEMENT';
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioUrl?: string; // If the message has an audio representation
  isWishConfirmation?: boolean;
}

export interface RetailResult {
  title: string;
  price: string;
  store: 'Walmart' | 'Target' | 'Best Buy';
  image: string;
  url: string;
}