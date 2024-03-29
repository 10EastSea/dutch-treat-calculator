/* index.html document ready */
function closeButton() {
    $("#revise_button_member").off();

    $("#revise_button_receipt").off();
    $("#delete_button_receipt").off();
}

$(document).ready(function () {
    $("form").submit(function() { return false; });

    ////////////////////////////////////////////////////////////////////////////////
    // add member
    $("#add_button_member").click(function() {
        var name = $("#add_input_member").val();
        addMember(name);
    });

    // next (member)
    $("#next_button_member").click(function() {
        if(checkMember() != "PASS") {
            if(checkMember() == "ONE_MEMBER") $("#alert_message").text("인원은 두 명 이상 있어야 합니다");
            else if(checkMember() == "DUPLICATE") $("#alert_message").text("중복된 이름을 가진 인원이 존재합니다");

            $("#alert_fail").show();
            setTimeout(function() { $("#alert_fail").fadeOut(); }, 1000);
            return;
        }

        // select_list
        $("#add_select_list_receipt").empty();
        $("#revise_select_list_receipt").empty();
        var add_select_list = $("#add_select_list_receipt");
        var revise_select_list = $("#revise_select_list_receipt");

        // checkbox_list
        $("#add_checkbox_list_receipt>div").remove();
        $("#revise_checkbox_list_receipt>div").remove();
        var add_checkbox_list = $("#add_checkbox_list_receipt");
        var revise_checkbox_list = $("#revise_checkbox_list_receipt");

        var trs = $("#table_member>tbody>tr");
        trs.each(function(i) {
            var tds = trs.eq(i).children();
            var name = tds.eq(1).text().trim();

            // select_list
            var tagContent = '<option value="' + name + '">' + name + '</option>'
            add_select_list.append(tagContent);
            revise_select_list.append(tagContent);
            
            // checkbox_list
            tagContent = 
                '<div class="form-check">' +
                    '<input name="add_participants_input" class="form-check-input" type="checkbox" checked>' +
                    '<label name="add_participants_label" class="form-check-label">' + name + '</label>'
                '</div>';
            add_checkbox_list.append(tagContent);
            tagContent = 
                '<div class="form-check">' +
                    '<input name="revise_participants_input" class="form-check-input" type="checkbox">' +
                    '<label name="revise_participants_label" class="form-check-label">' + name + '</label>'
                '</div>';
            revise_checkbox_list.append(tagContent);
        });

        $("#member").hide();
        $("#receipt").show();
    });
    ////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////
    // add receipt
    $("#add_button_receipt").click(function() {
        addReceipt();
    });

    // save receipt
    $("#save_button_receipt").click(function() {
        if(receipt_count < 1) {
            $("#alert_message").text("영수증을 먼저 추가해주세요");

            $("#alert_fail").show();
            setTimeout(function() { $("#alert_fail").fadeOut(); }, 1000);
            return;
        }
        html2canvas(document.querySelector("#list_receipt")).then(canvas => {
            saveImg(canvas.toDataURL('image/png'), "영수증.png");
        });
    });

    // prev (receipt)
    $("#prev_button_receipt").click(function() {
        $("#list_receipt").empty();

        $("#receipt").hide();
        $("#member").show();
    });
    // next (receipt)
    $("#next_button_receipt").click(function() {
        if(receipt_count >= 1) {
            calculate();
            $("#no_result").hide();
            $("#table_result").show();
        } else {
            $("#table_result").hide();
            $("#no_result").show();
        }

        $("#receipt").hide();
        $("#result").show();
    });
    ////////////////////////////////////////////////////////////////////////////////


    ////////////////////////////////////////////////////////////////////////////////
    // save result
    $("#save_button_result").click(function() {
        if(receipt_count < 1) {
            $("#alert_message").text("영수증을 먼저 추가해주세요");

            $("#alert_fail").show();
            setTimeout(function() { $("#alert_fail").fadeOut(); }, 1000);
            return;
        }
        html2canvas(document.querySelector("#card_result")).then(canvas => {
            saveImg(canvas.toDataURL('image/png'), "송금표.png");
        });
    });

    // prev (result)
    $("#prev_button_result").click(function() {
        onceBtnTrigger = true;
        $("#once_button_result").html("한번으로 송금 끝내기!");

        $("#result").hide();
        $("#receipt").show();
    });
    // once (result)
    var onceBtnTrigger = true;
    $("#once_button_result").click(function() {
        if(receipt_count >= 1) {
            if(onceBtnTrigger) {
                onceBtnTrigger = false;
                calculateSubsetProb();
                $("#once_button_result").html("기본 송금표");
            } else {
                onceBtnTrigger = true;
                calculate();
                $("#once_button_result").html("한번으로 송금 끝내기!");
            }
        }
    });
    ////////////////////////////////////////////////////////////////////////////////
});