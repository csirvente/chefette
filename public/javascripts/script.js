document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("IronGenerator JS imported successfully!");

    /*   dynamic hero title  begin*/

    function loop($swap) {
      var next =
        $swap
          .find("li.visible")
          .removeClass("visible")
          .index() + 1;

      if (next >= $swap.find("li").length) {
        next = 0;
      }

      $swap.width(
        $($swap.find("li").get(next))
          .addClass("visible")
          .outerWidth()
      );
      $swap.css({ transform: "translateY(-" + next * 3 + "rem)" });

      setTimeout(function() {
        loop($swap);
      }, 2000);
    }

    $(function() {
      $(".swap").each(function() {
        var $this = $(this);

        $this.find("li").each(function() {
          $(this).css({ top: $(this).index() * 3 + "rem" });
        });

        loop($this);
      });
    });
    /* dynamic hero title end */

    $(".recipe-item").click(function() {
      $(this).addClass("on");
      const recipesId = ($(this).attr("attr-recipe-id"));

      axios
        .post("/add-recipe", {recipesId})
        .then(response => {
          console.log("post success");
          console.log(response.data);
        })
        .catch(error => {
          console.log("Oh No! Error!");
          console.log(error);
        });
    });
  },
  false
);
