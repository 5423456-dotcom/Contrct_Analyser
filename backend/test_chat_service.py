import asyncio
from app.services.ai_service import get_sample_agreement, analyze_with_smart_heuristics, chat_with_contract

async def test_chat():
    print("--- 1. Testing Internship Agreement Chat ---")
    internship = get_sample_agreement("internship")
    analysis = analyze_with_smart_heuristics(internship["text"], [{"page_number": 1, "text": internship["text"]}])
    
    # Test Question 1: Resignation / Leave early
    res1 = await chat_with_contract(internship["text"], analysis, "Can I quit after 2 months or leave early?")
    print("Engine used:", res1.get("engine_used"))
    print("Reply preview:", res1.get("reply")[:200])
    print("Citations count:", len(res1.get("citations", [])))
    assert len(res1.get("citations", [])) > 0, "Expected at least 1 citation for exit/lock-in query"
    
    # Test Question 2: Stipend
    res2 = await chat_with_contract(internship["text"], analysis, "What is my stipend and when is it paid?")
    print("\nReply for stipend:", res2.get("reply")[:200])
    assert len(res2.get("citations", [])) > 0, "Expected at least 1 citation for stipend query"
    
    # Test Question 3: Code ownership / IP
    res3 = await chat_with_contract(internship["text"], analysis, "Who owns the code I write?")
    print("\nReply for IP:", res3.get("reply")[:200])
    assert len(res3.get("citations", [])) > 0, "Expected at least 1 citation for IP query"

    print("\n--- 2. Testing Hostel Agreement Chat ---")
    hostel = get_sample_agreement("hostel")
    hostel_analysis = analyze_with_smart_heuristics(hostel["text"], [{"page_number": 1, "text": hostel["text"]}])
    
    # Test Question: Curfew
    res4 = await chat_with_contract(hostel["text"], hostel_analysis, "Is there a curfew or gate closing time?")
    print("\nReply for Curfew:", res4.get("reply")[:200])
    assert len(res4.get("citations", [])) > 0, "Expected at least 1 citation for curfew query"

    print("\nAll chat tests passed successfully!")

if __name__ == "__main__":
    asyncio.run(test_chat())
