jQuery(function() {
    var md = new Remarkable();

    function addData(data) {
        // split the data between each h1
        // seek the first line that starts with '# '
        var cards = [];
        var current = "";
        data.split('\n').forEach(function(line) {
            if (/^# /.test(line)) {
                // new card was found, package the current
                if (current.trim().length > 0) {
                    cards.push(current.trim());
                }
                current = line;
            } else {
                current = current + '\n' + line;
            }
        });

        // And add the remainder, if any
        if (current.trim().length > 0) {
            cards.push(current.trim());
        }

        cards.forEach(addCard);
    }

    function addCard(card) {
        console.log("Adding card:", card);

        var html = md.render(card);

        $(`<div class="card-container"><div class="card">${html}</div></div>`)
            .appendTo($("#cards"))

        // <div class="card-container">
        //     <div class="card">
        //     </div>
        // </div>
    }

    $("#adventure-selector select").change(function() {
        let self = jQuery(this);

        $.get({
            url: "./adventures/" + self.val() + ".md",
            success: function(data) {
                addData(data);
            }
        });
    });
});