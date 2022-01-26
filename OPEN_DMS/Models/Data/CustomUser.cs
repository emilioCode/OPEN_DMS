using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OPEN_DMS.Models.Data
{
    public class CustomUser
    {
        public int id { get; set; }
        public string name { get; set; }
        public string accessLevel { get; set; }
        public int entityId { get; set; }
        public string entityName { get; set; }
        public int? teamId { get; set; }
        public string teamName { get; set; }
        public string userName { get; set; }
        public string hashCode { get; set; }
        public string pathRoot { get; set; }
        public DateTime expirationDate { get; set; }

        public CustomUser(int _id, string _name, string _accessLevel, int _entityId, string _entityName, int? _teamId, string _teamName, string _userName, string _hashCode, string _pathRoot, DateTime _expirationDate)
        {
            this.id = _id;
            this.name = _name;
            this.accessLevel = _accessLevel;
            this.entityId = _entityId;
            this.entityName = _entityName;
            this.teamId = _teamId;
            this.teamName = _teamName;
            this.userName = _userName;
            this.hashCode = _hashCode;
            this.pathRoot = _pathRoot;
            this.expirationDate = _expirationDate;
        }   
    }
}
