using System;
using System.Collections.Generic;

#nullable disable

namespace OPEN_DMS.Models
{
    public partial class Team
    {
        public int Id { get; set; }
        public int EntityId { get; set; }
        public string TeamName { get; set; }
        public string PathRoot { get; set; }
        public string TelephoneNumber { get; set; }
        public string HostName { get; set; }
        public int? PortNumber { get; set; }
        public string Email { get; set; }
        public string Pass { get; set; }
        public bool Disabled { get; set; }
    }
}
