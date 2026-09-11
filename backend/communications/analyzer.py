import re


def analyze_communication(content):
    text = content.strip()

    summary = create_summary(text)
    decisions = extract_decisions(text)
    action_items = extract_action_items(text)
    risks = extract_risks(text)

    return {
        "summary": summary,
        "decisions": decisions,
        "action_items": action_items,
        "risks": risks,
    }


def create_summary(text):
    sentences = re.split(r"(?<=[.!?])\s+", text)

    sentences = [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

    if not sentences:
        return "No summary available."

    if len(sentences) <= 2:
        return " ".join(sentences)

    return " ".join(sentences[:2])


def extract_decisions(text):
    decisions = []

    decision_patterns = [
        r"approved (?:the )?(.+?)(?:\.|$)",
        r"decided to (.+?)(?:\.|$)",
        r"agreed to (.+?)(?:\.|$)",
        r"confirmed (.+?)(?:\.|$)",
    ]

    lower_text = text.lower()

    for pattern in decision_patterns:
        matches = re.findall(pattern, lower_text)

        for match in matches:
            decision = match.strip()

            if decision:
                decisions.append(
                    decision.capitalize() + "."
                )

    return remove_duplicates(decisions)


def extract_action_items(text):
    action_items = []

    deadline_words = (
        "today",
        "tomorrow",
        "friday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "saturday",
        "sunday",
    )

    sentences = re.split(r"(?<=[.!?])\s+", text)

    for sentence in sentences:
        sentence = sentence.strip()

        if not sentence:
            continue

        lower_sentence = sentence.lower()

        has_action = any(
            phrase in lower_sentence
            for phrase in [
                "will ",
                "must ",
                "needs to ",
                "need to ",
                "should ",
                "is responsible for",
            ]
        )

        if not has_action:
            continue

        person = extract_person(sentence)
        task = extract_task(sentence)
        deadline = extract_deadline(
            sentence,
            deadline_words
        )

        if task:
            action_items.append(
                {
                    "person": person,
                    "task": task,
                    "deadline": deadline,
                }
            )

    return action_items


def extract_person(sentence):
    match = re.search(
        r"\b([A-Z][a-z]+)\s+(?:will|must|needs to|should)\b",
        sentence,
    )

    if match:
        return match.group(1)

    responsibility_match = re.search(
        r"\b([A-Z][a-z]+)\s+is responsible for\b",
        sentence,
        flags=re.IGNORECASE,
    )

    if responsibility_match:
        return responsibility_match.group(1)

    role_match = re.search(
        r"\b(the\s+)?(client|contractor|architect|designer|vendor|supplier|developer|manager|team)\s+(?:will|must|needs to|should)\b",
        sentence,
        flags=re.IGNORECASE,
    )

    if role_match:
        return role_match.group(2).capitalize()

    return "Not specified"

def extract_task(sentence):
    patterns = [
        r"\bwill\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
        r"\bmust\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
        r"\bneeds to\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
        r"\bneed to\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
        r"\bshould\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
        r"\bis responsible for\s+(.+?)(?:\s+by\s+|\s+before\s+|\.|$)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            sentence,
            flags=re.IGNORECASE,
        )

        if match:
            return match.group(1).strip()

    return ""


def extract_deadline(sentence, deadline_words):
    lower_sentence = sentence.lower()

    for word in deadline_words:
        if word in lower_sentence:
            return word.capitalize()

    by_match = re.search(
        r"\bby\s+([^,.]+)",
        sentence,
        flags=re.IGNORECASE,
    )

    if by_match:
        return by_match.group(1).strip()

    before_match = re.search(
        r"\bbefore\s+([^,.]+)",
        sentence,
        flags=re.IGNORECASE,
    )

    if before_match:
        return "Before " + before_match.group(1).strip()

    return "Not specified"


def extract_risks(text):
    risks = []

    sentences = re.split(r"(?<=[.!?])\s+", text)

    risk_phrases = [
        "delay",
        "risk",
        "may affect",
        "could affect",
        "might affect",
        "impact",
        "problem",
        "issue",
    ]

    for sentence in sentences:
        lower_sentence = sentence.lower()

        if any(
            phrase in lower_sentence
            for phrase in risk_phrases
        ):
            risks.append(sentence.strip())

    return remove_duplicates(risks)


def remove_duplicates(items):
    result = []

    for item in items:
        if item not in result:
            result.append(item)

    return result