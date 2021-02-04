export interface HostPlayerProps {
  children: React.ReactNode;
}

export interface Token {
  message: string;
  player: {
    created_at: string;
    id: string;
    jump_code: unknown | null;
    last_played: string;
    last_user_id: string;
    name: null | string;
    token: string;
  };
}
