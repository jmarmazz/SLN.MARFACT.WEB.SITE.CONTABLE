using System;

namespace MF.TOOLS
{
    public sealed class MFException : System.Exception
    {

        public MFException(Enum value) : base(value.ToString("D"))
        {
        }
    }
}
