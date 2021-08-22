// Global set-able variables (YOU CAN EDIT)
///////////////////////////////////////////

// Set the colour of the retry button differently to the submit button:
const retryButtonColor = "#ff0026";

// The retry text to look for (case sensitive):
// Change this should to match the text visible on your retry button (case sensitive) so that the javascript can find it and change it.
const retryButtonText = "Retry";

// The default MCQ and GMCQ aria text to apply if left blank
// Change this to whatever you like, ie "Select an answer to submit it" (if you're not showing submit buttons)
const mcqWithSubmitAriaText = "Select an answer and then click submit";
const mcqWithoutSubmitAriaText = "Select an answer to submit";

//////////////////////////////////////////
//////////////////////////////////////////



// Page adjustments that must happen immediately
////////////////////////////////////////////////
// Each time a page loads or changes, this function is run multiple times. So only things which NEED to have an immediate effect should be placed in here so as to not slow down page loads.
function immediateCourseSpecificPageAdjustments() {
	
    // place function calls in here
	
}



// Page adjustments that can wait a split second
////////////////////////////////////////////////
// This is generally only run once per page load or change, but there is a split second delay between the page change and it running.
// Most page adjustments should be placed in here.
function delayedCourseSpecificPageAdjustments() {

    makeAllHeadingsTabbable();
    makeScreenReaderOnlySectionsTabbable();
    makeMediaGridItemsTabbable();
    accessibleMcqComponentAdjustments();
    accessibleAudioComponentAdjustments();
		
    showAndHideCompletableLinks();
    changeRetryButtonColor();
    // setUpBackButton();
        
}
