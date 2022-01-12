using System;
using System.Collections.Generic;

#nullable disable

namespace OPEN_DMS.Models
{
    public partial class Entity
    {
        public int Id { get; set; }
        public string EntityName { get; set; }
        public bool Disabled { get; set; }
    }
}
