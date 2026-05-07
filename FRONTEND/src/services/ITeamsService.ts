export interface ICreateTeamRequest {
  name: string;
  description?: string;
  managerId?: string;
  members?: string[];
}

export interface IUpdateTeamRequest {
  name?: string;
  description?: string;
  managerId?: string;
  members?: string[];
}

export interface ITeamsService {
  createTeam(teamData: ICreateTeamRequest): Promise<void>;
  getTeams(): Promise<any[]>;
  updateTeam(id: string, teamData: IUpdateTeamRequest): Promise<void>;
  deleteTeam(id: string): Promise<void>;
}