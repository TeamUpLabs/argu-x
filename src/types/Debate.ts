export interface Debate {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "ROUND_1" | "ROUND_2" | "ROUND_3" | "FINISHED";
  img: string;
  cons: {
    title: string;
    count: number;
    insights: Insight[];
  };
  pros: {
    title: string;
    count: number;
    insights: Insight[];
  };

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

  comments: {
    id: number;
    content: string;
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
  }[];
}

export interface Insight {
  id: number;
  content: string;
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
  voted_count: number;
  voted_users: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    created_at: string;
    updated_at: string;
    voted_at: string;
  }[];
}
