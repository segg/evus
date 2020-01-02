# EVUS AUTOFILL
A Chrome extension to autofill [EVUS](www.evus.gov) (evus.gov) forms using previous enrollments.

Once in a while you have to do a new enrollment on www.evus.gov for people
visiting US from China.
Perhaps for yourself, your parents, friends, or clients.

There is absolutely no fun typing the answers for the numerous questions.
Even if you had a previous enrollment at hand, it is still tedious labor
work copy-pasting over all the information. 

EVUS AUTOFILL will not help you if it is your first time doing an enrollment.
However,
if you had an expired enrollment, this extension will copy its data
to the new enrollment forms and thus save you time to enjoy your life.

## How to use?

### Install this Chrome extension
(Until this is published to the Chrome web store)
1. Clone this repo
1. Install the unpacked extension in Chrome
    ([detailed steps](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/))

### Import from previous enrollments
1. Following "CHECK EXISTING ENROLLMENT" to the page showing all the information
    submitted for your last enrollment.
    The enrollment number or group id might be found in your email used for your
    last enrollment. Try searching "evus" in your email box.
    ![CHECK EXISTING ENROLLMENT](check_existing_enrollment.png)
    ![Enrollment page](enrollment_page.png)
1. Once you are on the page showing your last enrollment, click the extension icon
    on the Chrome toolbar to open the popup menu and then click "Import data" button.
    ![import button](import_button.png)
    The imported enrollment will show up in the popup menu.
    ![import success](import_success.png)

### Autofill new enrollment forms
1. Following "NEW ENROLLMENT" to start a new enrollment.
2. Once on the forms click the extension icon to open the popup menu.
3. Click the green button to autofill the forms.
    ![autofill](autofill.png)
4. Click "NEXT" on the page. An error prompt might pop up. Just ignore it
    and click "NEXT" again.
    ![error](error.png)
5. Repeat 2-4 till all the forms have been filled out.

Feel free to make changes to the data fields if needed.
Clicking the green button will __override__ the form with the imported data.

## Caveat
* Currently for the Yes/No questions it does not autofill the answers to the
    further questions when "Yes" is selected. One exception is that it does
    autofill employment information.
* It blindly autofill "No" to all the eligibility questions.
* It does not autofill Yes/No questions if evus.gov website is loaded in Chinese
   though it should not be hard to fix this issue.


## Disclaimer
Make sure you review the new enrollment carefully before submission.
The extension only does copy-paste and you are still responsible for
the correctness of all the information submitted.