import InstanceApi from "./instanceApi";
import { ITeamsService, ICreateTeamRequest, IUpdateTeamRequest } from "./ITeamsService";

export class TeamsService implements ITeamsService {
  private api = InstanceApi;

  async createTeam(teamData: ICreateTeamRequest): Promise<void> {
    await this.api.post("/equipes", teamData);
  }

  async getTeams(): Promise<any[]> {
    const response = await this.api.get("/equipes");
    return response.data;
  }

  async updateTeam(id: string, teamData: IUpdateTeamRequest): Promise<void> {
    await this.api.put(`/equipes/${id}`, teamData);
  }

  async deleteTeam(id: string): Promise<void> {
    await this.api.delete(`/equipes/${id}`);
  }
}