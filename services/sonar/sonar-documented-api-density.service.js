'use strict'

const SonarBase = require('./sonar-base')
const {
  patternBase,
  queryParamSchema,
  getLabel,
  positiveMetricColorScale,
} = require('./sonar-helpers')

const metric = 'public_documented_api_density'

module.exports = class SonarDocumentedApiDensity extends SonarBase {
  static get category() {
    return 'analysis'
  }

  static get defaultBadgeData() {
    return { label: getLabel({ metric }) }
  }

  static render({ density }) {
    return {
      message: `${density}%`,
      color: positiveMetricColorScale(density),
    }
  }

  static get route() {
    return {
      base: 'sonar',
      pattern: `${patternBase}/${metric}`,
      queryParamSchema,
    }
  }

  async handle({ protocol, host, component }, { sonarVersion }) {
    const json = await this.fetch({
      sonarVersion,
      protocol,
      host,
      component,
      metricName: metric,
    })
    const { metricValue: density } = this.transform({ json, sonarVersion })
    return this.constructor.render({ density })
  }
}