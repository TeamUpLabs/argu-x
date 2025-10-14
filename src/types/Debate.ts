export interface Debate {
  id: number;
  title: string;
  category: string;
  img: string;
  cons: {
    title: string;
    count: number;
    users: {
      id: number;
      name: string;
      voted_at: string;
    }[];
  };
  pros: {
    title: string;
    count: number;
    users: {
      id: number;
      name: string;
      voted_at: string;
    }[];
  }
  status: string;

  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;

  creator: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
  };
}
