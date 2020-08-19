print("File: ",end="")
Filename = input()
f = open(Filename, "r")
Lines = f.read().splitlines()

# print((Lines[0]))

jam = int(Lines[0][0:2])
menit = int(Lines[0][3:5])
detik = int(Lines[0][6:8])  
incorrect = 0

lamajam = 0
lamamenit = 0
lamadetik = 0

for i in range(len(Lines)):
    if(jam < 10):
        printjam = "0" + str(jam)
    if(menit < 10):
        printmenit = "0" + str(menit)
    if(detik < 10):
        printdetik = "0" + str(detik)
    if(jam > 10):
        printjam = int(jam)
    if(menit > 10):
        printmenit = int(menit)
    if(detik > 10):    
        printdetik = int(detik)
    if(detik == 59):
        detik = -1
        menit += 1
    if(menit == 59):
        menit = -1
        jam += 1
    if(jam == 24):
        jam = -1    
    if(lamadetik == 59):
        lamadetik = -1
        lamamenit += 1
    if(lamamenit == 59):
        lamamenit = -1    

    cocok = str(printjam) + ":" + str(printmenit) + ":" + str(printdetik)
    if(cocok != Lines[i]):
        incorrect += 1
    detik += 1
    lamadetik += 1
    # print(cocok)
    # print(Lines[i])
    # print(cocok == Lines[i])

print("Waktu awal: " + str(Lines[0]))
print("Waktu akhir " + str(Lines[len(Lines)-1]))
print("Lama pengujian: " + str(lamajam) + ":" + str(lamamenit) + ":" + str(lamadetik))
print("Total data: " + str(len(Lines)))
print("Total error: " + str(incorrect)) 
print("Rasio error: " + str(incorrect/len(Lines) * 100) + " %" )
