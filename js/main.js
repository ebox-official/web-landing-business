var textForRotation = ["Made Simple", "Made Safe", "Made Reversible", "Reinvented"];
var textForRotationIndex = 1;
var rotateTime = 3000;

function rotateText() {
    document.querySelector("#rotatedText").style.opacity = "0";

    setTimeout(function() {
        document.querySelector("#rotatedText").innerHTML = textForRotation[textForRotationIndex];
        document.querySelector("#rotatedText").style.opacity = "1";

        document.querySelector("#rotatedTextUnderline").style.width = document.querySelector("#rotatedText").offsetWidth + "px";
        
        textForRotationIndex = ++textForRotationIndex % textForRotation.length;
    
        setTimeout(rotateText, rotateTime);
    }, 450);
}

rotateText();

function scrollParallax(elementSelector, triggerElement, duration, transformFrom, transformTo) {

    var tween = new TimelineMax().
        add([
            TweenMax.fromTo(
                elementSelector,
                1,
                { transform: transformFrom },
                { transform: transformTo, ease: Linear.easeNone }
            )
        ]);

    // build scene
    new ScrollMagic.Scene({ triggerElement, duration })
        .setTween(tween)
        // .addIndicators()
        .addTo(new ScrollMagic.Controller());
}

// scrollParallax(
//     "#roadmap-ghost-title",
//     "#roadmap-ghost-title-trigger",
//     333,
//     "translate(-50%, -20%)",
//     "translate(-50%, -80%)"
// );

let Scrollbar = window.Scrollbar;
let scrollbar = Scrollbar.init(document.querySelector('#main-scrollbar'), {
    continuousScrolling: false
});

window.addEventListener('hashchange', function () {
    let hash = window.location.hash;
    if (hash) {
        let target = document.getElementById(hash.substring(1));
        if (target) {
            scrollbar.scrollIntoView(target, {
                offsetTop: -scrollbar.containerEl.scrollTop,
            });
        }
    }
}, false);

function q(el, sel) {
    return el.querySelector(sel);
}

async function sendEmail(f) {
    let [name, subject, email, message] = [q(f, "#name"), q(f, "#subject"), q(f, "#contact-us-email"), q(f, "#message")].map(el => el.value);
    
    // show a loader
    let submit = q(f, "#contact-us-submit");
    let prevSubmitText = submit.textContent;
    submit.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';

    let payload = new URLSearchParams({
        "action": "submit",
        "form": "contact_business",
        "fields[name]": name,
        "fields[subject]": subject,
        "fields[mail]": email,
        "fields[message]": message
    });

    // send message
    let response = await fetch("https://ebox.io/api/form_data/form_data.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: payload
        }
    );
    let responseData = JSON.parse(await response.text());

    let notification = q(f, ".contact-us-notification");
    if (responseData.error) {

        // notify error
        notification.innerHTML = `
<div class="alert alert-danger alert-dismissible fade show mt-4 mb-0" role="alert">
    <strong>Something went wrong.</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        `;
    } else {

        // notify success
        notification.innerHTML = `
<div class="alert alert-success alert-dismissible fade show mt-4 mb-0" role="alert">
    <strong>Well done</strong> &ndash; Let's elevate your project to new heights together!
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        `;

        // clean fields
        f.reset();
    }

    // reset submit
    submit.innerHTML = prevSubmitText;

    // needed to prevent refresh
    return false;
}

async function subscribe(f) {
    let email = q(f, "#subscribe-email").value;
    
    // show a loader
    let submit = q(f, "#subscribe-submit");
    let prevSubmitText = submit.textContent;
    submit.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"></div>';

    let payload = new URLSearchParams({
        "action": "submit",
        "form": "newsletter",
        "fields[mail]": email
    });

    // send message
    let response = await fetch("https://ebox.io/api/form_data/form_data.php",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: payload
        }
    );
    let responseData = JSON.parse(await response.text());

    let notification = q(f, ".subscribe-notification");
    if (responseData.error) {

        // notify error
        notification.innerHTML = `
<div class="alert alert-danger alert-dismissible fade show mt-4 mb-0" role="alert">
    <strong>Something went wrong.</strong>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        `;
    } else {

        // notify success
        notification.innerHTML = `
<div class="alert alert-success alert-dismissible fade show mt-4 mb-0" role="alert">
    <strong>Welcome to the community!</strong><br>We'll keep in touch.
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
</div>
        `;

        // clean fields
        f.reset();
    }

    // reset submit
    submit.innerHTML = prevSubmitText;

    // needed to prevent refresh
    return false;
}