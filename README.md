# Knight Hacks 2025 Team DRIP Submission -- Invincible AI Web App Sumarizer

Incorporates Elevenlabs, Facebook BART Model, Google Gemini API, and Google Cloud Gemini A2A Agent Developer Kit to develop a superhero artificial intelligent summarizer that is multimodal; particularly summarizing text and audio with a capacity for text to speech use of these characters.

This application is inspired by the television series "Invincible" where the three bots that you can converse with are Mark (Invincible), Atom Eve, and Omniman. Users can decide which character to chat with depending on their purposes.

The chat's are not designed to answer questions, but rather to summarize text and audio quickly.

We use elevenlabs text to speech api, with three unique voices.

For audio usage we first use elevenlabs speech to text translator -> pass it through summarizer system -> output in both texts and desired character speech.

Summarizer System:
We use Facebook's BART Summarizer as our default summarizer, after computing a few ablation studies with alternative large language models evaluating on the dataset CNN. The BART model tended to perform nearly the best, and it was selected as it was the most optimal model in terms of local model usage. The BERT model summarizes all inputs to a pretty similar range of outputs regardless of input size, so we use agent to agent protocols to speak with google gemini to tell the BERT model what it missed out on the first batch of summarization. Since our application mimicks messages, we decide to send each subset of the summary in the intervals they are processed by the Summarizer System.

The particular algorithm for deciding whether a summary is sufficient or not is based on the following heuristic we decided:

Let x represent the number of characters in our input.

We want it so if x is relatively small the summary is going to be practically the same length
If x is big we want it to print ~20 percent of the characters orginally -- e.g., len(summary) ~ 0.2x
The actual x's we decided for bounds are 100 and 2000, and we use a linear first order spline to decide the percentage of characters we want outputted.

f(x) = {1 if x<=100, 0.2 if x>= 2000, 1 - 8/19000(x-100)}

We also allow a bit of freeway so we allow a difference of up to 5% and use the following notion to determine whether or not to pass it on to Gemini

if f(x) > [len(summary)/x] - 0.05:
  pass to google gemini model to figure out what is missed in summarization
else:
  finish algorithm

For more than 1 iterations of passing to Google Gemini, len(summary) = len(summary_1) + len(summary_2) + ... + len(summary_n).

For each summary_i, in the user interface we print a text message and allow the option for voice playback from the character.
