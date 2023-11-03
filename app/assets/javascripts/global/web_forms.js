table = $('table#stat'),
rows = $('table#stat tr#stat-rows'),
classes = [];
rows.each(function(i, e) {
    classes.push(e.className);
});
classes.sort(function(a, b){return b-a});
for (i = 0; i < classes.length; i++) {
    table.append(table.find('tr.' + classes[i]));
}