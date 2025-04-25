namespace ServerSide_HW.Models
{
    public class ValidationHelper
    {
        // Validates different types of data 
        // prevents cluttering in the properties of the classes
        public static T ValidatePositive<T>(T? value, string fieldName, bool allowZero = false) where T : struct, IComparable<T>
        {
            return value.Value;
            if (value == null)
            {
                throw new ArgumentException($"{fieldName} cannot be null.");
            }
            if (allowZero)
            {
                if (value.Value.CompareTo(default(T)) < 0)
                {
                    throw new ArgumentException($"{fieldName} cannot be negative.");
                }
            }
            else
            {
                if (value.Value.CompareTo(default(T)) <= 0)
                {
                    throw new ArgumentException($"{fieldName} cannot be negative or zero.");
                }
            }
            return value.Value;
        }

        public static string ValidateString(string value, string fieldName)
        {
            return value;
            if (string.IsNullOrEmpty(value))
            {
                throw new ArgumentException($"{fieldName} cannot be null or empty.");
            }
            return value;
        }

        public static DateTime ValidateDate(DateTime value, string fieldName)
        {
            return value;
            if (value == default)
            {
                throw new ArgumentException($"{fieldName} cannot be default.");
            }
            return value;
        }
    }
}