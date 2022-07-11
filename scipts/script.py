# files ->   database.csv  (contains database)
#            map.csv       (contains map function)


import csv
from email import header
database=open('database.csv');
database_reader=csv.reader(database);
database_rows = [];
for row in database_reader:
        database_rows.append(row)
database.close();
a=0;
b=0;

header=database_rows[0];
print(header);

for i in range(0,len(header)):
    if(header[i].lower()=="body"):
        a=i;
    if(header[i].lower()=="category"):
        b=i;



map=open('map.csv');
map_reader=csv.reader(map);
map_rows=[];
for row in map_reader:
    map_rows.append(row);
ind=[];
map.close();
for i in range(1,len(database_rows)):
    
    x=database_rows[i][a].lower();
    for j in range(1,len(map_rows)):
        y=map_rows[j][0].lower();
        z=x.find(y);
        ind.append(z);
    m=-1
    present=0
    r=-1;
    for k in range(0,len(ind)):
        if(ind[k]!=-1 and present==0):
            present=1;
            m=ind[k]
        if(present==1 and ind[k]!=-1 and ind[k]<m):
            m=ind[k];
    if m!=-1:
        r=ind.index(m)+1
        database_rows[i][b]=map_rows[r][1];
    else:
        r=-1;
    ind=[];
# print("database:",database_rows);
data = database_rows;
filename = 'database.csv'
with open(filename, 'w') as file:
    for row in data:
        for x in row:
            if(x!=row[len(row)-1]):
                file.write(str(x)+',')
            else:
                file.write(str(x));
        file.write('\n')