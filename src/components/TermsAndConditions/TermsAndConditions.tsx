import React, { useEffect } from 'react';
import { useSignal } from '@preact/signals-react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MetricsClient from '../../clients/MetricsClient';

const TermsAndConditions = () => {
  const open = useSignal(false);
  const acceptButtonDisabled = useSignal(true);

  const handleReject = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Terms Rejected',
    });

    window.location.href = '/api/auth/logout';
  };

  const handleAccept = () => {
    // Tracking in app insights
    MetricsClient.sendEvent({
      name: 'ChatApp Terms Accepted',
    });

    localStorage.setItem('termsAccepted', '1.0.0');
    open.value = false;
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const nearBottomOfScroll =
      Math.abs(
        e.currentTarget.scrollHeight - (e.currentTarget.scrollTop + e.currentTarget.clientHeight),
      ) <= 30;

    if (nearBottomOfScroll) {
      acceptButtonDisabled.value = false;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('termsAccepted') !== '1.0.0') {
      open.value = true;
    }
  }, []);

  return (
    <Dialog
      hideBackdrop
      open={open.value}
      scroll="paper"
      aria-labelledby="scroll-terms-title"
      aria-describedby="scroll-terms-description"
    >
      <DialogTitle id="scroll-terms-title">Terms and Conditions</DialogTitle>
      <DialogContent id="scroll-terms-content" dividers onScroll={handleScroll}>
        <div>
          <b>
            <u>Privileged and Confidential</u>
          </b>
        </div>
        <br />
        <div>
          <b>U.S. Oncology Network (“USON”) Terms and Conditions of Use – McKesson’s ChatApp</b>
        </div>
        <div>
          <b>EFFECTIVE DATE: December, 2023</b>
        </div>
        <div>
          <b>VERSION: 1.0.0</b>
        </div>
        <br />
        <div>
          McKesson’s ChatApp (“ChatApp” or “McKesson ChatApp”) is an enterprise-class solution
          offering a chat-based interface, akin to ChatGPT, offered by McKesson Technology to
          employees and certain, other authorized users via{' '}
          <a href="https://chatapp.usoncology.com">chatapp.usoncology.com</a>. McKesson’s ChatApp is
          provided to you for your convenience, to amplify productivity, and to expose you to
          cutting-edge technology. If you are a clinical employee of a medical oncology practice
          that has entered into a US Oncology Network Agreement for practice management services,
          then these Terms of Use will govern your access to and/or use of McKesson’s ChatApp. The
          following terms and conditions govern the use of McKesson’s ChatApp and the responses
          generated and available therein.
        </div>
        <br />
        <div>
          <b>ChatApp Terms and Conditions of Use</b>
        </div>
        <br />
        <ol>
          <li>
            Entering any proprietary business information, confidential information, Personal or{' '}
            <strong>
              <u>
                Protected Health Information (PHI), or other personal data (also known as “personal
                information” or “personally identifiable information”) in ChatApp is prohibited.
              </u>
            </strong>
          </li>
          <br />
          <li>
            Access and use of McKesson’s ChatApp will be continuously tracked and monitored by
            security personnel. By accessing and using ChatApp, you expressly consent to such
            monitoring. In addition to continuous tracking and monitoring by security personnel, you
            are the first and best line of defense in keeping McKesson, USON, and your practice’s
            data, and that of its individual stakeholders, confidential and private.
          </li>
          <br />
          <li>
            ChatApp is not a replacement for humans or human judgment nor is it a substitute for
            exercising critical thinking. ChatApp is not and should not be used as a replacement for
            professional medical evaluation, advice, diagnosis, or treatment. ChatApp, similar to
            any artificial intelligence (AI) system, may hallucinate or produce unexpected
            responses. ChatApp’s responses may not be accurate and may be out-of-date, especially
            since ChatApp’s training data cuts off in 2021.
          </li>
          <br />
          <li>
            ChatApp is for business use only, therefore, the personal use of ChatApp is prohibited.
            When in doubt about the use of ChatApp, do not enter any information in ChatApp.
            Instead, please reach out to{' '}
            <a href="mailto:MTAutomationTeam@McKesson.com">MTAutomationTeam@McKesson.com</a> and/or
            <a href="mailto:DigitalandDataLegal@McKesson.com"> DigitalandDataLegal@McKesson.com</a>.
            For additional “Do’s and Don’ts,” see McKesson Technology’s one-page guide.
          </li>
          <br />
          <li>
            You may not use, copy, modify, distribute, translate, reproduce, republish, disassemble,
            reverse engineer, decompile, mirror, frame, hyperlink or transmit any of the content or
            materials of McKesson’s ChatApp or rent or sell use of or access to (such as on a time
            share or service bureau basis) McKesson’s ChatApp, or any of the content or materials on
            McKesson’s ChatApp. You may not permit third parties to access McKesson’s ChatApp or use
            any McKesson ChatApp content.
          </li>
          <br />
          <li>
            You agree to use McKesson ChatApp for lawful purposes only. You may not use McKesson
            ChatApp, or any McKesson ChatApp content, in any fashion other than as expressly
            authorized herein, unless otherwise expressly agreed to in writing by McKesson.
          </li>
          <br />
          <li>
            McKesson or its affiliates or vendor does not guarantee and makes no warranties
            regarding your ability to access ChatApp. McKesson or its affiliates or vendor expressly
            disclaims any warranty of uptime or availability. McKesson or its affiliates (e.g., the
            U.S. Oncology Network) reserves the right to, without notice, change, modify, suspend or
            discontinue any Services or content available on or through ChatApp at any time without
            notice, or otherwise change specifications at any time.
          </li>
          <br />
          <li>
            If ChatApp provides electronic links to other websites run by third parties
            (“third-party websites”), these links are available for your convenience only and are
            not intended as an endorsement by McKesson or its affiliates or vendor of those
            third-party websites. You assume all risk for use of any third-party website and
            McKesson or its affiliates or vendor assumes no liability for (i) any content that a
            third-party may make available or communicate through this Website, (ii) the operation
            or security of third-party websites or (iii) any products or services offered by such
            third-parties.
          </li>
          <br />
          <li>
            These Terms of Use, together with our Privacy Notice ,{' '}
            <a
              href="https://mckessoncorp.sharepoint.com/sites/Policies/Shared Documents/Forms/AllItems.aspx?id=%2Fsites%2FPolicies%2FShared%20Documents%2FInformation%20Security%20and%20IT%20Risk%20Management%2FAcceptable%20Use%20Policy%2Epdf&parent=%2Fsites%2FPolicies%2FShared%20Documents%2FInformation%20Security%20and%20IT%20Risk%20Management"
              target="_blank"
              rel="noreferrer"
            >
              Acceptable Use Policy
            </a>
            , and{' '}
            <a
              href="https://mckessoncorp.sharepoint.com/sites/Policies/Shared Documents/Forms/AllItems.aspx?id=%2Fsites%2FPolicies%2FShared%20Documents%2FPrivacy%2FWorker%20Data%20Privacy%20Policy%2Epdf&parent=%2Fsites%2FPolicies%2FShared%20Documents%2FPrivacy"
              target="_blank"
              rel="noreferrer"
            >
              Worker Data Privacy Policy
            </a>
            , constitute the agreement between you and the U.S. Oncology Network (“USON”) regarding
            access and/or use of McKesson’s ChatApp. BY ACCESSING OR USING MCKESSON’S CHATAPP, YOU
            AGREE TO BE BOUND BY AND ABIDE BY THESE TERMS AND CONDITIONS OF USE.
          </li>
        </ol>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} title="reject-button">
          Reject
        </Button>
        <Button disabled={acceptButtonDisabled.value} onClick={handleAccept} title="accept-button">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TermsAndConditions;
