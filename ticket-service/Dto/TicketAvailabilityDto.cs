namespace TicketService.DTOs
{
    public class TicketAvailabilityDto
    {
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Quota { get; set; }
        public int SoldQuota { get; set; }
        public int AvailableQuota { get; set; }
    }
}
