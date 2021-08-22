// Global Variables
////////////////////////////////

// variable to holder the timer for page load refresh delays
let newPageTimoutID;
// Flag to set on user action to indicate if the next set of DOM mutations are a new page loading
let newPageLoading = true;
// Indicates if this is the first run of this custom code on the page
let firstHref;
// Indicates if the landing page has shown once already
let landingPageSeen = false;
// Indicates if this is the landing page
let isLandingPage = false;

////////////////////////////////
////////////////////////////////



// Set up a function to be called whenever the page layout or contents changes (The DOM changes)
const mutationObserver = new MutationObserver(function(mutations) {
	
	mutations.forEach( function(mutation) {
		// run these custom functions upon each change
		
		// do things that need to and happen immediately
		immediatePageAdjustments();

		// wait a second for the others - so it only does it for the last mutation in a group
		window.clearTimeout(newPageTimoutID);
		newPageTimoutID = window.setTimeout(delayedPageAdjustments, 50);
		
	});
	
});



// Start the mutation observer to listen for DOM changes
mutationObserver.observe( document.documentElement, {
    childList: true,
    subtree: true,
    //attributes: false,
    //characterData: true,
    //attributeOldValue: false,
    //characterDataOldValue: true
});



// Page adjustments that must happen immediately
////////////////////////////////////////////////
// Each time a page loads or changes, this function is run multiple times. So only things which NEED to have an immediate effect should be placed in here so as to not slow down page loads.
function immediatePageAdjustments() {
	
	convertCodeComponents();
	
	// run anything defined in the course specific file too
	immediateCourseSpecificPageAdjustments();
	
}



// Page adjustments that can wait a split second
////////////////////////////////////////////////
// This is generally only run once per page load or change, but there is a split second delay between the page change and it running.
// Most page adjustments should be placed in here.
function delayedPageAdjustments() {
    
    if( newPageLoading ) {
        moveFocusToTop();
        newPageLoading = false;
    }
        
    // accessibility edits
    addTopFocusActionToInternalLinks(); // This is required to move focus to top of page when a new page loads
		
    // run anything defined in the course specific file too
	delayedCourseSpecificPageAdjustments();
	
}



// Convert code components into spacers or screenreader only elements
////////////////////////////////////////////////////
// 

function convertCodeComponents() {
	
	
	$(".ev-code-component").each( function () {
		
		let $codeInner = $(this).find(".ev-code-inner");
			
		// get references to items inside
		let $title = $codeInner.find(".ev-component-title");
		let $body = $codeInner.find(".ev-component-body");
		let $instructions = $codeInner.find(".ev-component-instruction");
		let $code = $codeInner.find("pre");

		
		if( $code.length ) {
			// component has code to show
			// leave it as is.
			
		} else {
			// component doesn't have code to show
			// adjust based on if other text is included
			
			// title, body, or instruction text
			if( $title.length || $body.length || $instructions.length ) {
				// Has text for screenreader
				// Make invisible and remove its effect on layout
				$(this).addClass("uo_screenreader-only");
			
			} else {
				// Is just a spacer
				// Make invisible but keep its effect on layout
				$(this).addClass("uo_spacer");
				
			}
						
		}	
        
				
	} );
	
}



// Non-linear image links with "complete" indicators
////////////////////////////////////////////////////
// This function expects both incomplete and complete versions of the links to be in the same link component and the incomplete version of the link should be directly after the complete version. The Complete version should be set as disabled until the section is complete. This function then hides the appropriate one based on that information.
function showAndHideCompletableLinks() {
    
	// Define the suffixes to look for in the images alt tag
    let incompleteSuffix = ", incomplete";
    let completeSuffix = ", complete";
    
	
	// convert to lowercase for checking later
    incompleteSuffix = incompleteSuffix.toLowerCase();
    completeSuffix = completeSuffix.toLowerCase();
    
    // find all link widgets in page
    $(".ev-links-widget").each( function (articleIndex) {
        let completedLinkIsVisible;

        
        // find each link inside the link widget
        $(this).find(".ev-grid-item").each( function (itemIndex) {
            let $curLinkItem = $(this);

            
            // find the image in the link to check the alt text
            $curLinkItem.find("img").each( function (index2) {
                let curLinkAlt = $(this).attr("alt").toLowerCase();
                
                
                if( curLinkAlt.indexOf(completeSuffix)>0 ) {
                    // It is the completed image
                    ////////////////////////////
                                        
                    // Check if the link is disabled (hasn't been completed yet)
                    // Hide it if it is disabled
                    if( $curLinkItem.find(".ev-links-disabled-button").length || $curLinkItem.find(".ev-links-disabled").length ) {

                        $curLinkItem.css("display", "none");
                        completedLinkIsVisible = false;
                        
                    } else {
                        completedLinkIsVisible = true;
                    }
                    
                    
                } else {
                    // It is the uncompleted image
                    //////////////////////////////
                    
                    // Assumes the link right before it was the completed link version of this item
                    if( completedLinkIsVisible ) {
                        
                        // hide the incomplete link since the complete link is enabled/showing
                        $curLinkItem.css("display", "none");
                        
                    }
                    
					// reset the flag to check the next link
                    completedLinkIsVisible = undefined;
                }
                
                
            });
            
        });

    });
    
}



// Set internal links to refresh focus
//////////////////////////////////////
// Gives all internal links on the page an extra click action that sets a flag to say a new page is loading and focus should be shifted to the top of the new page.
function addTopFocusActionToInternalLinks() {
    
    $(".ev-links-internal" ).one( "click", function () {
        newPageLoading = true;    
    })
    
}



// Shift the users focus to the top of the page
///////////////////////////////////////////////
// Finds the first element on the page from a predefine set of tags and moves the users focus to it.
// Important for keyboard navigation and screenreaders.
function moveFocusToTop() {
    
    // find the first valid element on the page
    let $firstItem = $(".uo_screenreader-only, h1, h2, h3, h4, h5, h6").first()
    // text and graphic components are screenreader-only components out of evolve
    // p not included because they are used for spacing elements out and other random spots
    
    // Make the first item found the first tabbable element on the page
    $firstItem.attr("tabindex", "1");
	
    // Make back button the second tabbable item on the page
    $("#uo_back-button").attr("tabindex", "2");
    
    // Manually set the current focus to the first item
    $firstItem.focus();
    
}



// Functions to make varous elements tabbable
/////////////////////////////////////////////
function makeAllHeadingsTabbable() {
    let $headings = $("h1, h2, h3, h4, h5");

//    if($headings.attr("tabindex") == undefined ||
//       $headings.attr("tabindex") == false ) {
        
        $headings.attr("tabindex", "0");
//    }
    
}
//
function makeScreenReaderOnlySectionsTabbable() {
    let $screenReaderText = $(".uo_screenreader-only");
	
    if($screenReaderText.attr("tabindex") == undefined || $screenReaderText.attr("tabindex") == false ) {
        $screenReaderText.attr("tabindex", "0");
    }
}
//
function makeMediaGridItemsTabbable() {
    $(".ev-mediaGrid-component .ev-grid-item").attr("tabindex", "0");
}



// Make MCQ components more screenreader accessible
///////////////////////////////////////////////////
// Make any text within the same block of n MCQ tabbable in order to ensure user gets some context
function accessibleMcqComponentAdjustments() {
    
    // find all mcq's on the page
    let $mcqs = $(".ev-mcq-inner");
	
    // find all containers (blocks) of each the mcq's
    // let $container = $mcqs.closest(".ev-component-container");
    // Make the body text in every MCQ tabbable as it likely relates to the question
	// Removed because it's probably a little too forceful.
	// $container.find(".ev-component-body").attr("tabindex", "0");

    	
    // add an aria label to the mcq (so it doesn't have to be done one at at a time in Evolve)
    $mcqs.each( function() {
        $mcqInstructions = $(this).find(".ev-component-instruction");
        $mcqAnswerGroup = $(this).find(".ev-mcq-items");
        const numAnswers = $mcqAnswerGroup.find(".ev-mcq-item").length;
        const hasSubmit = $(this).find(".ev-buttons-action").length;
        
        // Force the radio group's aria-label to be read out
        $mcqAnswerGroup.attr("tabindex", "0");
								
        // $mcqAnswerGroup.attr("aria-label") == undefined ||
        // $mcqAnswerGroup.attr("aria-label") == typeof undefined ||
        // $mcqAnswerGroup.attr("aria-label") == false
			
		// Remove the reference to the instruction text by "labelledby" because it reads it at a weird time
		$mcqAnswerGroup.attr("aria-labelledby", null );

        // Count the answers
				
        if( $mcqAnswerGroup.attr("aria-label") ) {
            // If there's an aria-label set, just read out that as is
		
        } else if( $mcqInstructions.length ) {
            // Otherwise, if there's the instruction text, read out that (but with better timing)
            $mcqAnswerGroup.attr("aria-label", $mcqInstructions.text() );

		} else {
			// Otherwise, read out this generic text
            if(hasSubmit) {
                $mcqAnswerGroup.attr("aria-label", `${numAnswers} possible answers, ${mcqWithSubmitAriaText}`);
            } else {
                $mcqAnswerGroup.attr("aria-label", `${numAnswers} possible answers, ${mcqWithoutSubmitAriaText}`);
            }

        }

    });
    
    
}



// Make Audio components more screenreader accessible
/////////////////////////////////////////////////////
// Find all audio components on the page, make them invisible to screenreaders and keyboard navigation and create a new hidden element for screenreaders
// TODO: This will cause issues for keyboard only sighted users, however, the elements of the browser based audio component can't be edited - A better solution would be to build a VISIBLE replacement for the audio component.
function accessibleAudioComponentAdjustments() {
    
	// find each audio component on the page
    $(".ev-audio-player").each( function() {
        let $audioComponent = $(this);
        
		// set it to not be tabbable
        $audioComponent.attr("tabindex", "-1");
        
        // bail if a replacement audio button has already been created
        if( $audioComponent.next().hasClass("uo_screenreader_audio-button") ) return false;
        
        // Create a new button after the audio component that is only visible to screen readers
        $audioComponent.after( '<button href="#" id="audioControl" class="uo_screenreader_audio-button uo_screenreader-only">play audio</button>' );
        let $audioButton = $audioComponent.next();

		// define the buttons actions
        $audioButton.click( function() { 
            let $thisButton = $(this);
            let $audioComponent = $thisButton.prev();
                        
            // Update the Button
            if( $audioComponent.prop("paused") == true ) {
                $audioComponent.trigger("play");
                $thisButton.html( "pause audio" );
                
            } else {
                $audioComponent.trigger("pause");
                $thisButton.html( "play audio" );
                
            }

            // Prevent Button doing a button tag's default Action
            return false;
        });
        
    });
    
}



////////////////////////////////////////////////////////
// Functions below can be called in the functions above.
////////////////////////////////////////////////////////


// Set up a back button
///////////////////////
// As long as it's not the landing page
function setUpBackButton() {
    
    // Only set up the back button functionality once
    if(firstHref == undefined) {
        firstHref = "visited";//window.location.href;
        
        $("#uo_back-button").click( function() {
            goBackAPage();
        });
    }
    
	// check if we're on the landing page or another page
    if(window.history.length <= 2) {    // it's set to 2 because there's an unseen reload or redirection in loading.
        // The user isn't or can't go back from this page so hide the back button
        
        $("#uo_back-button").hide();
		
    } else {
        // it's a subsequent page, so show the back button
       
        let $backButton = $("#uo_back-button");
        $backButton.removeClass("uo_hidden"); // remove the css class that hides it during load
        $backButton.show();
    }
}



// Load the previous page
/////////////////////////
function goBackAPage() {
    newPageLoading = true;
    window.history.back();
}



// Edit the style of button variations that can't be changed in Evolve
//////////////////////////////////////////////////////////////////////
function changeRetryButtonColor() {
    
     $("button").each( function (articleIndex) {
		 
		// Check if the button is a retry button
		if( $(this).text()==retryButtonText ) {

			// set button color
			$(this).css("background-color", retryButtonColor);

			// mutation observer doesn't fire when retry is clicked so set up a listener
			$(this).one("click", function revertButtonStyles() {
				// revert colors when retry is clicked (as it changes back to submit)
				$(this).removeAttr("style");
			});

		}
		 

    });
    
}
