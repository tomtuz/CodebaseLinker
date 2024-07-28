/**
 * Fixture Provider for Configuration Tests
 * 
 * This file serves as a central export point for various configuration fixtures
 * used in testing the configuration loading and validation process.
 * 
 * By centralizing these exports, we make it easy to import different
 * configuration scenarios in our tests, promoting consistency and reusability.
 */

import valid_config from "./valid.config"
import invalid_config from "./invalid.config"
import { DEFAULT_CONFIG as default_config } from "./default.config"

// Export named configurations for use in tests
export {
  valid_config,    // A valid configuration object
  invalid_config,  // An intentionally invalid configuration for testing error cases
  default_config   // The default configuration used as a base
}

/**
 * Usage in tests:
 * 
 * import { valid_config, invalid_config, default_config } from '../fixtures/configs'
 * 
 * Then use these imported configurations in your test cases as needed.
 */
