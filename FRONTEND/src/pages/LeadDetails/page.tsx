import { LeadsService } from "../../services/implementations/LeadsService"
import { NegotiationService } from "../../services/implementations/NegotiationsService"
import { useLeadDetailsModel } from "./leadDetails.model"
import { LeadDetailsView } from "./leadDetails.view"

const LeadDetails = () => {
    const leadsService = new LeadsService()
    const negotiationService = new NegotiationService()
    const methods = useLeadDetailsModel({
        leadsService,
        negotiationService
    })

    return <LeadDetailsView {...methods} />
}

export default LeadDetails;