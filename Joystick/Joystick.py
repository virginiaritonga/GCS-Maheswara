import pygame
pygame.init()
 
# Set the width and height of the screen [width,height]
#size = [500, 980]
#screen = pygame.display.set_mode(size)
 
#pygame.display.set_caption("Joystick")
 
#Loop until the user clicks the close button.

done = False
 
# Used to manage how fast the screen updates
clock = pygame.time.Clock()
 
# Initialize the joysticks
pygame.joystick.init()
   
file1 = open("Joystick/Input.txt","w") 
# Get ready to print
#textPrint = TextPrint()
# -------- Main Program Loop -----------
while done==False:
    # if data == "2":
    #     for i in range(100):
    #         print("HELLo")
    #     data = "1"
    #EVENT PROCESSING STEP
    for event in pygame.event.get(): # User did something
        if event.type == pygame.QUIT: # If user clicked close
            done=True # Flag that we are done so we exit this loop
       
        # Possible joystick actions: JOYAXISMOTION JOYBALLMOTION JOYBUTTONDOWN JOYBUTTONUP JOYHATMOTION
        if event.type == pygame.JOYBUTTONDOWN:
            #print("Joystick button pressed.")
            joystick_count = pygame.joystick.get_count()
            for i in range(joystick_count):
                # file1.seek(0)
                # file1.write("")  
                # file1.truncate()
                joystick = pygame.joystick.Joystick(i)
                joystick.init()
                #button = joystick.get_button( i )
                #print(i)
                if(joystick.get_button( 0 ) == 1):
                    print("ATAS")
                    
                    file1.seek(0)
                    file1.write("ATAS")  
                    file1.truncate()
                    
                elif(joystick.get_button( 1 ) == 1):
                    print("KANAN")
                    file1.seek(0)
                    file1.write("KANAN")  
                    file1.truncate()
                elif(joystick.get_button( 2 ) == 1):
                    print("BAWAH")
                    file1.seek(0)
                    file1.write("BAWAH")  
                    file1.truncate()
                elif(joystick.get_button( 3 ) == 1):
                    print("KIRI")
                    file1.seek(0)
                    file1.write("KIRI")  
                    file1.truncate()
        # if event.type == pygame.JOYBUTTONUP:
        #     #print("Joystick button released.")
        #     a = 0
           
 
    # DRAWING STEP
    # First, clear the screen to white. Don't put other drawing commands
    # above this, or they will be erased with this command.
    #screen.fill(darkgrey)
    #textPrint.reset()
 
    # Get count of joysticks
    joystick_count = pygame.joystick.get_count()
 
    #textPrint.print(screen, "Number of joysticks: {}".format(joystick_count) )
    #textPrint.indent()
   
    # For each joystick:
    for i in range(joystick_count):
        joystick = pygame.joystick.Joystick(i)
        joystick.init()
       
 
   
    # ALL CODE TO DRAW SHOULD GO ABOVE THIS COMMENT
   
    # Go ahead and update the screen with what we've drawn.
    #pygame.display.flip()
 
    # Limit to 20 frames per second
    #clock.tick(20)
   
# Close the window and quit.
# If you forget this line, the program will 'hang'
# on exit if running from IDLE.
#pygame.quit ()
