import Map "mo:base/HashMap";
import Text "mo:base/Text";

/**
 * PaintTranslator Canister
 *
 * This canister serves as a caching layer between natural language queries
 * and their corresponding structured Paint API queries. It stores translations
 * to avoid redundant AI processing of similar queries.
 */
actor PaintTranslator {
  // Type Definitions

  /**
   * Represents a structured query for the Paint API
   * @field query_type - The type of query (e.g., "temperature", "maxvoc")
   * @field value - The text value for the query
   */
  type APIQuery = {
    query_type : Text;
    value : Text;
  };

  /**
   * Represents a cached translation entry
   * @field natural_query - The original natural language query
   * @field structured_query - The translated API query
   * @field api_response - The response from the Paint API (as JSON string)
   */
  type TranslationEntry = {
    natural_query : Text;
    structured_query : APIQuery;
    api_response : Text;
  };

  /**
   * Main storage for our translations
   * Uses the natural language query as the key for quick lookups
   */
  private var translations = Map.HashMap<Text, TranslationEntry>(
    0, // Initial capacity (grows as needed)
    Text.equal, // Function to compare Text values
    Text.hash // Function to hash Text values
  );

  /**
   * Checks if we have a cached translation for a given natural language query
   *
   * @param natural_query - The query to look up
   * @returns Optional TranslationEntry - Some(entry) if found, null if not
   */
  public query func check_cache(natural_query : Text) : async ?TranslationEntry {
    translations.get(natural_query);
  };

  /**
  * Clears the cache for testing purposes
  *
  */
  public func clear_cache() : async () {
    translations := Map.HashMap<Text, TranslationEntry>(
      0,
      Text.equal,
      Text.hash,
    );
  };

  /**
   * Stores a new translation in the cache
   *
   * @param natural_query - The original natural language query
   * @param query_type - The type of structured query (e.g., "temperature")
   * @param query_value - The numeric value for the query
   * @param api_response - The JSON string response from the Paint API
   */
  public func store_translation(
    natural_query : Text,
    query_type : Text,
    query_value : Text,
    api_response : Text,
  ) : async () {
    // Create the translation entry
    let entry : TranslationEntry = {
      natural_query;
      structured_query = {
        query_type;
        value = query_value;
      };
      api_response;
    };

    // Store it in our translations map
    translations.put(natural_query, entry);
  };
};
