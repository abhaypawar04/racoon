// calculate area using class
#include<iostream>
using namespace std ;

class Rectangle
{
	public : 
		int length ,breadth;
		int area ()
		{
			return length*breadth;
		}
};

int main()
{
		Rectangle r;
		r.length=12;
		r.breadth=11;
		cout<<r.area();
		return 0;
		
}
