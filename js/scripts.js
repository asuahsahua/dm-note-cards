jQuery(function() {
    var md = new Remarkable();

    $("#adventure-selector select").change(function() {
        let self = jQuery(this);

        $.get({
            url: "./adventures/" + self.val() + ".md",
            success: addCards
        });
    });

    function addCards(data) {
        $("#cards").html("");

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

        switch (cards.length % 3) {
            case 0:
                break;
            case 1:
                cards.push("");
                cards.push("");
                break;
            case 2:
                cards.push("");
                break;
        };

        cards.forEach(addCard);

        // rearrange the cards so we can print front and back
        var front = $(".front");
        var back = $(".back");
        var cardsDiv = $("#cards");

        // chunk by 3 both ways
        var frontChunks = _(front).chunk(3);
        var backChunks = _(back).chunk(3);

        // Redistribute
        cardsDiv.html("");
        for (i = 0; i < frontChunks.length; i++) {
            frontChunks[i].forEach(function(element) {
                cardsDiv.append(element);
            });
            backChunks[i].forEach(function(element) {
                cardsDiv.append(element);
            });
        }
    }

    function addCard(card) {
        var lines1 = card.split('\n');
        var lines2 = [];

        var card1Container = $(`<div class="card-container front"></div>`);
        var card1 = $(`<div class="card"></div>`);
        card1.appendTo(card1Container);
        $("#cards").append(card1Container);

        var card2Container = $(`<div class="card-container back"></div>`);
        var card2 = $(`<div class="card"></div>`);
        card2.appendTo(card2Container);
        $("#cards").append(card2Container);

        // TODO: Multiple cards, front and back?
        do {
            card1.html(md.render(lines1.join('\n')));
            card2.html(md.render(lines2.join('\n')));

            if (card1[0].scrollHeight <= card1Container.height()) {
                break;
            }

            lines2.unshift(lines1.pop());
        } while (true && lines1.length);
    }

    $("#adventure-selector select").val("phandelver");
    $.get({
        url: "./adventures/phandelver.md",
        success: addCards
    });
});