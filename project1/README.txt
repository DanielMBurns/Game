Daniel Burns
Evan Murray


five circles wih radius 2.0 and five triangles of height 2.0 move from top to bottom 
at a rate of 0.01  and 0.03 per run of render, respectively. Upon reaching the bottom, 
each shape is moved to a random distance between 0 and 1 above the top of the screen, 
then it travels at the same rate toward the bottom. 
    A 2.0 x 1.0 rectangle sits on the bottom. It is moved left by pressing A, and right 
by pressing S. After every run of render(), it is checked if the rectangle is being hit 
by a circle or triangle. If a circle is hitting the rectangle, a point is added to the 
score. If a triangle is hitting the rectangle, the animation stops, game over.
    The shapes move on a white background, with a green border. The border is made of 
two .975 X .025 rectangles along the bottom and left side, and a .025 wide shape made 
with TRIANGLE_FAN that borders the top and right side.  
