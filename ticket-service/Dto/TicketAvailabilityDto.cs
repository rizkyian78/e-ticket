namespace TicketService.DTOs
{
    public class TicketAvailabilityDto
    {
        public Guid Id { get; set; }
        public string Code { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Currency { get; set; } = null!;
        public int Quota { get; set; }
        public decimal Amount { get; set; }
        public int SoldQuota { get; set; }
        public int AvailableQuota { get; set; }
    }
}
