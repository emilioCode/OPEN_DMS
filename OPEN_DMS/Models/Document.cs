using System;
using System.Collections.Generic;

#nullable disable

namespace OPEN_DMS.Models
{
    public partial class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Extension { get; set; }
        public float Size { get; set; }
        public int TeamId { get; set; }
        public DateTime InsertionDate { get; set; }
        public string PathAlternative { get; set; }
        public string CommentDetail { get; set; }
        public string DistinctDetail { get; set; }
        public int IdUser { get; set; }
        public bool Disabled { get; set; }
    }
}
