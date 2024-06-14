// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.9;

interface IOracle {
    struct Content {
        string contentType;
        string value;
    }

    struct Message {
        string role;
        Content[] content;
    }

    struct OpenAiRequest {
        // "gpt-4-turbo", "gpt-4-turbo-preview" or "gpt-3.5-turbo-1106"
        string model;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 frequencyPenalty;
        // JSON string or empty string
        string logitBias;
        // 0 for null
        uint32 maxTokens;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 presencePenalty;
        // JSON string or empty string
        string responseFormat;
        // 0 for null
        uint seed;
        // empty str for null
        string stop;
        // 0-20, > 20 for null
        uint temperature;
        // 0-100  percentage, > 100 for null
        uint topP;
        // JSON list for tools in OpenAI format, empty for null, names have to match the supported tools
        string tools;
        // "none", "auto" or empty str which defaults to auto on OpenAI side
        string toolChoice;
        string user;
    }

    struct OpenAiResponse {
        string id;
        // either content is an empty str or functionName and functionArguments
        string content;
        string functionName;
        string functionArguments;
        uint64 created;
        string model;
        string systemFingerprint;
        // kind of pointless since its always "chat.completion"?
        string object;
        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }

    struct GroqRequest {
        // "llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768" or "gemma-7b-it"
        string model;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 frequencyPenalty;
        // JSON string or empty string
        string logitBias;
        // 0 for null
        uint32 maxTokens;
        // int -20 - 20, Mapped to float -2.0 - 2.0. If bigger than 20 then null
        int8 presencePenalty;
        // JSON string or empty string
        string responseFormat;
        // 0 for null
        uint seed;
        // empty str for null
        string stop;
        // 0-20, > 20 for null
        uint temperature;
        // 0-100  percentage, > 100 for null
        uint topP;
        string user;
    }

    struct GroqResponse {
        string id;
        string content;
        uint64 created;
        string model;
        string systemFingerprint;
        // kind of pointless since its always "chat.completion"?
        string object;
        uint32 completionTokens;
        uint32 promptTokens;
        uint32 totalTokens;
    }

    struct KnowledgeBaseQueryRequest {
        string cid;
        string query;
        uint32 num_documents;
    }

    function createLlmCall(uint promptId) external returns (uint);

    function createGroqLlmCall(
        uint promptId,
        GroqRequest memory request
    ) external returns (uint);

    function createOpenAiLlmCall(
        uint promptId,
        OpenAiRequest memory request
    ) external returns (uint);

    function createFunctionCall(
        uint functionCallbackId,
        string memory functionType,
        string memory functionInput
    ) external returns (uint i);

    function createKnowledgeBaseQuery(
        uint kbQueryCallbackId,
        string memory cid,
        string memory query,
        uint32 num_documents
    ) external returns (uint i);
}
contract ChatGpt {
    struct Message {
        string role;
        string content;
    }

    struct ChatRun {
        address owner;
        Message[] messages;
        uint messagesCount;
    }

    mapping(uint => ChatRun) public chatRuns;
    uint private chatRunsCount;

    event ChatCreated(address indexed owner, uint indexed chatId);

    address private owner;
    address public oracleAddress;
    string public knowledgeBase;

    event OracleAddressUpdated(address indexed newOracleAddress);

    constructor(address initialOracleAddress, string memory knowledgeBaseCID) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        knowledgeBase = knowledgeBaseCID;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }

    function startChat(string memory message) public returns (uint i) {
        ChatRun storage run = chatRuns[chatRunsCount];

        run.owner = msg.sender;
        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount = 1;

        uint currentId = chatRunsCount;
        chatRunsCount = chatRunsCount + 1;

        // If there is a knowledge base, create a knowledge base query
        if (bytes(knowledgeBase).length > 0) {
            IOracle(oracleAddress).createKnowledgeBaseQuery(
                currentId,
                knowledgeBase,
                message,
                3
            );
        } else {
            // Otherwise, create an LLM call
            IOracle(oracleAddress).createLlmCall(currentId);
        }
        emit ChatCreated(msg.sender, currentId);

        return currentId;
    }

    function onOracleLlmResponse(
        uint runId,
        string memory response,
        string memory /*errorMessage*/
    ) public onlyOracle {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("user")),
            "No message to respond to"
        );

        Message memory newMessage;
        newMessage.content = response;
        newMessage.role = "assistant";
        run.messages.push(newMessage);
        run.messagesCount++;
    }

    function onOracleKnowledgeBaseQueryResponse(
        uint runId,
        string[] memory documents,
        string memory /*errorMessage*/
    ) public onlyOracle {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("user")),
            "No message to add context to"
        );
        // Retrieve the last user message
        Message storage lastMessage = run.messages[run.messagesCount - 1];

        // Start with the original message content
        string memory newContent = lastMessage.content;

        // Append "Relevant context:\n" only if there are documents
        if (documents.length > 0) {
            newContent = string(
                abi.encodePacked(newContent, "\n\nRelevant context:\n")
            );
        }

        // Iterate through the documents and append each to the newContent
        for (uint i = 0; i < documents.length; i++) {
            newContent = string(
                abi.encodePacked(newContent, documents[i], "\n")
            );
        }

        // Finally, set the lastMessage content to the newly constructed string
        lastMessage.content = newContent;

        // Call LLM
        IOracle(oracleAddress).createLlmCall(runId);
    }

    function addMessage(string memory message, uint runId) public {
        ChatRun storage run = chatRuns[runId];
        require(
            keccak256(
                abi.encodePacked(run.messages[run.messagesCount - 1].role)
            ) == keccak256(abi.encodePacked("assistant")),
            "No response to previous message"
        );
        require(run.owner == msg.sender, "Only chat owner can add messages");

        Message memory newMessage;
        newMessage.content = message;
        newMessage.role = "user";
        run.messages.push(newMessage);
        run.messagesCount++;
        // If there is a knowledge base, create a knowledge base query
        if (bytes(knowledgeBase).length > 0) {
            IOracle(oracleAddress).createKnowledgeBaseQuery(
                runId,
                knowledgeBase,
                message,
                3
            );
        } else {
            // Otherwise, create an LLM call
            IOracle(oracleAddress).createLlmCall(runId);
        }
    }

    function getMessageHistoryContents(
        uint chatId
    ) public view returns (string[] memory) {
        string[] memory messages = new string[](
            chatRuns[chatId].messages.length
        );
        for (uint i = 0; i < chatRuns[chatId].messages.length; i++) {
            messages[i] = chatRuns[chatId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(
        uint chatId
    ) public view returns (string[] memory) {
        string[] memory roles = new string[](chatRuns[chatId].messages.length);
        for (uint i = 0; i < chatRuns[chatId].messages.length; i++) {
            roles[i] = chatRuns[chatId].messages[i].role;
        }
        return roles;
    }
}
