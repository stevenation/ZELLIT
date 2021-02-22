list =  [
    "Abilene Christian University",
    "Adventist Health",
    "Alabama State University",
    "Alfred University",
    "Allengheny College",
    "Allegion TU",
    "Amherst College",
    "Andrews University",
    "Angelo State University",
    "Appa;achian State University",
    "ATU",
    "ATUP",
    "Auburn University",
    "Auburn University of Montgomery",
    "Augusta University",
    "Avera Specialty Hospital",
    "Azusa Pacific University",
    "Babson College",
    "Banner Health",
    "Barry University",
    "Bayhealth Medical Center",
    "Baystate Health",
    "Belmont Abbey College",
    "Beloit College",
    "Bethune-Cookman University",
    "Bismarck State College",
    "Boise State University",
    "Bon Secours Mercy Health",
    "Boston College",
    "Brandeis University",
    "Bridgewater College",
    "Brown University",
    "Cornell University",
    "Luther College",
    "Wartburg College",

]
f = open("b.txt",'a')
f.write("[")
for uni in list:
    f.write("{label:" + "'" +str(uni) +"'" + ",\n value:" +"'"+ str(uni).lower()+"'" +"},\n" )
f.write("]")
f.close()
