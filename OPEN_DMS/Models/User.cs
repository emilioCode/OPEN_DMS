using System;
using System.Collections.Generic;

#nullable disable

namespace OPEN_DMS.Models
{
    public partial class User
    {
        public int Id { get; set; }
        public string CompleteName { get; set; }
        public string Description { get; set; }
        public string UserAccount { get; set; }
        public string UserPassword { get; set; }
        public int TeamId { get; set; }
        public string AccessLevel { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public bool Disabled { get; set; }
    }
}
