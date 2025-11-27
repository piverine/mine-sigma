from fastapi import APIRouter

from app.schemas import (
    OfficerAssignedAlert,
    OfficerSiteVisit,
    OfficerAaiFlag,
    CitizenComplaint,
    OfficerOverviewResponse,
)

router = APIRouter(prefix="/api/officer", tags=["officer"])


@router.get("/overview", response_model=OfficerOverviewResponse)
async def get_officer_overview() -> OfficerOverviewResponse:
    assigned_alerts = [
        OfficerAssignedAlert(
            id="ALT-2024-001",
            mine_name="Jharia Coal Block 4",
            district="Dhanbad, Jharkhand",
            severity="High",
            status="Action Required",
            due_in_hours=6,
        ),
        OfficerAssignedAlert(
            id="ALT-2024-002",
            mine_name="Keonjhar Sector 2",
            district="Keonjhar, Odisha",
            severity="Medium",
            status="Review in Progress",
            due_in_hours=24,
        ),
    ]

    pending_site_visits = [
        OfficerSiteVisit(
            id="SV-2024-011",
            site_name="Bailadila Sector 14",
            district="Dantewada, Chhattisgarh",
            scheduled_for="2024-01-29",
            priority="High",
        ),
        OfficerSiteVisit(
            id="SV-2024-012",
            site_name="Singareni Block 3",
            district="Kothagudem, Telangana",
            scheduled_for="2024-01-31",
            priority="Medium",
        ),
    ]

    recent_aai_flags = [
        OfficerAaiFlag(
            id="AAI-2024-145",
            mine_name="Korba West Mine",
            flag_type="Encroachment Pattern",
            confidence_percent=96,
            detected_at="2024-01-28T10:00:00Z",
        ),
        OfficerAaiFlag(
            id="AAI-2024-146",
            mine_name="Talcher Coalfield East",
            flag_type="Unusual Overburden Movement",
            confidence_percent=89,
            detected_at="2024-01-28T07:00:00Z",
        ),
    ]

    citizen_complaints = [
        CitizenComplaint(
            id="CIT-CHAIN-0x8A23",
            category="Illegal Mining",
            location="Near Jharia Railway siding",
            submitted_at="2024-01-28T09:30:00Z",
            status="New",
        ),
        CitizenComplaint(
            id="CIT-CHAIN-0x9F10",
            category="Environmental Damage",
            location="Village Barbil outskirts",
            submitted_at="2024-01-27T14:15:00Z",
            status="Under Verification",
        ),
    ]

    return OfficerOverviewResponse(
        assigned_alerts=assigned_alerts,
        pending_site_visits=pending_site_visits,
        recent_aai_flags=recent_aai_flags,
        citizen_complaints=citizen_complaints,
    )
