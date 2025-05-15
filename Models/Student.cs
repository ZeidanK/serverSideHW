using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerSide_HW.Models
{
    public class Student
    {
        string name;
        double age;
        int id;

        public string Name { get => name; set => name = value; }
        public double Age { get => age; set => age = value; }
        public int Id { get => id; set => id = value; }

        public Student(string name, double age, int id)
        {
            Name = name;
            Age = age;
            Id = id;
        }

        public Student() { }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.Insert(this);
        }

        public int Update()
        {
            DBservices dbs = new DBservices();
            return dbs.Update(this);

        }

        public List<Student> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.Read();
        }

        public void Init()
        {
            //DBservices dbs = new DBservices();
            //dbs.Init();
        }

    }
}