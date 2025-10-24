export interface Debate {
  id: number;
  title: string;
  description: string;
  category: string;
  status: "ROUND_1" | "ROUND_2" | "ROUND_3" | "FINISHED";
  img: string;
  cons: {
    id: number;
    title: string;
    count: number;
    argx_amount: number;
    insights: Insight[];
  };
  pros: {
    id: number;
    title: string;
    count: number;
    argx_amount: number;
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

  comments: Comment[];
}

export interface Insight {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  argx_amount: number;
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
    argx: number;
  }[];
  side?: 'pros' | 'cons';
  debate_side_id?: number;
}

export interface Comment {
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
}
